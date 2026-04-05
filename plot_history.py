import sys
import os
from datetime import datetime

import polars as pl
import plotly.graph_objects as go
from plotly.subplots import make_subplots

OUTPUT_DIR = "/tmp/yahoo_data"

BULL_COLOR = "#26a69a"
BEAR_COLOR = "#ef5350"

# Timeframe definitions: UI Label -> Polars Resample String
TF_CONFIG = {
    "Daily": {"every": None, "lookback_1y": 252, "fmt": "%Y-%m-%d"},
    "Weekly": {"every": "1w", "lookback_1y": 52, "fmt": "%Y-%m-%d"},
    "Monthly": {"every": "1mo", "lookback_1y": 12, "fmt": "%Y-%m"},
    "Quarterly": {"every": "3mo", "lookback_1y": 4, "fmt": "%Y-%m"},
}

LOOKBACK_LABELS = ["1M", "3M", "6M", "1Y", "5Y", "YTD", "All"]


def resample(df: pl.DataFrame, every: str | None) -> pl.DataFrame:
    if every is None:
        return df
    # Ensure date is sorted for dynamic grouping
    return (
        df.sort("date")
        .group_by_dynamic("date", every=every)
        .agg(
            pl.col("open").first(),
            pl.col("high").max(),
            pl.col("low").min(),
            pl.col("close").last(),
            pl.col("quote_volume").sum(),
        )
        .sort("date")
    )


def make_colors(df: pl.DataFrame) -> list[str]:
    return df.select(
        pl.when(pl.col("close") >= pl.col("open"))
        .then(pl.lit(BULL_COLOR))
        .otherwise(pl.lit(BEAR_COLOR))
        .alias("color")
    )["color"].to_list()


def plot_interactive_history(symbol: str):
    file_path = os.path.join(OUTPUT_DIR, f"{symbol}_history.csv")
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found. Run fetch_yahoo_historical.py first.")
        return

    # 1. Load base data
    df_base = (
        pl.read_csv(file_path)
        .with_columns(date=pl.col("date").str.to_datetime(time_zone="UTC"))
        .sort("date")
    )

    # 2. Pre-compute all timeframes
    tf_data = {}
    for label, cfg in TF_CONFIG.items():
        df_res = resample(df_base, cfg["every"])
        tf_data[label] = {
            "df": df_res,
            "dates": df_res["date"].dt.strftime(cfg["fmt"]).to_list(),
            "colors": make_colors(df_res),
            "n_bars": len(df_res),
        }

    # 3. Build Figure
    fig = make_subplots(
        rows=2,
        cols=1,
        shared_xaxes=True,
        vertical_spacing=0.04,
        subplot_titles=(f"{symbol} Price", "Quote Volume (USD)"),
        row_heights=[0.6, 0.4],
    )

    all_traces = []
    visibility_masks = {}
    
    # 4. Add traces for all timeframes (initially hidden)
    trace_idx = 0
    for label in TF_CONFIG:
        d = tf_data[label]
        
        # Candlestick
        fig.add_trace(
            go.Candlestick(
                x=d["dates"],
                open=d["df"]["open"],
                high=d["df"]["high"],
                low=d["df"]["low"],
                close=d["df"]["close"],
                name=f"{label} Price",
                increasing_line_color=BULL_COLOR,
                decreasing_line_color=BEAR_COLOR,
                visible=(label == "Daily"),
            ),
            row=1, col=1
        )
        
        # Volume
        fig.add_trace(
            go.Bar(
                x=d["dates"],
                y=d["df"]["quote_volume"],
                name=f"{label} Volume",
                marker_color=d["colors"],
                opacity=0.8,
                visible=(label == "Daily"),
            ),
            row=2, col=1
        )
        
        # Track indices for visibility toggle
        visibility_masks[label] = [False] * (len(TF_CONFIG) * 2)
        visibility_masks[label][trace_idx] = True
        visibility_masks[label][trace_idx + 1] = True
        trace_idx += 2

    # 5. Helper for range calculations
    def get_range_args(label: str, lookback_str: str):
        d = tf_data[label]
        n = d["n_bars"]
        
        if lookback_str == "All":
            r = [-0.5, n - 0.5]
        elif lookback_str == "YTD":
            max_year = d["df"]["date"].max().year
            ytd_count = len(d["df"].filter(pl.col("date").dt.year() == max_year))
            r = [max(0, n - ytd_count) - 0.5, n - 0.5]
        else:
            # Map labels to bar counts based on timeframe intensity
            multipliers = {"1M": 1/12, "3M": 1/4, "6M": 1/2, "1Y": 1, "5Y": 5}
            lb_bars = int(TF_CONFIG[label]["lookback_1y"] * multipliers[lookback_str])
            r = [max(0, n - lb_bars) - 0.5, n - 0.5]
            
        return {"xaxis.range": r, "xaxis2.range": r}

    # 6. Create Timeframe Buttons
    # Each button updates visibility AND categories AND title
    tf_buttons = []
    for label in TF_CONFIG:
        d = tf_data[label]
        # Initial range for this timeframe (1Y)
        init_range = get_range_args(label, "1Y")["xaxis.range"]
        
        tf_buttons.append(dict(
            label=label,
            method="update",
            args=[
                {"visible": visibility_masks[label]},
                {
                    "title.text": f"<b>ANTIGRAVITY TERMINAL</b> — {symbol} · {label}",
                    "xaxis.categoryarray": d["dates"],
                    "xaxis2.categoryarray": d["dates"],
                    "xaxis.range": init_range,
                    "xaxis2.range": init_range,
                }
            ]
        ))

    # 7. Create Range Buttons (These are harder because they depend on CURRENT timeframe)
    # Since we are static, we'll create buttons that "default" to Daily or we use a multi-step update.
    # Actually, the user can just use the range slider or zoom. 
    # But let's try to make them work for the Daily default for now, or just leave them out if they break the UX.
    # High quality choice: Range buttons that update based on the currently selected timeframe are not possible in static Plotly.
    # So we'll provide the Timeframe toggle as the primary high-value feature.
    
    grid_style = dict(showgrid=True, gridwidth=1, gridcolor="rgba(255,255,255,0.05)")

    fig.update_layout(
        template="plotly_dark",
        title=dict(
            text=f"<b>ANTIGRAVITY TERMINAL</b> — {symbol} · Daily",
            font=dict(size=22, color="white", family="Inter, sans-serif"),
            x=0.02,
        ),
        xaxis=dict(
            type="category",
            categoryorder="array",
            categoryarray=tf_data["Daily"]["dates"],
            range=get_range_args("Daily", "1Y")["xaxis.range"],
            rangeslider=dict(visible=False),
            nticks=12,
            **grid_style,
        ),
        xaxis2=dict(
            type="category",
            categoryorder="array",
            categoryarray=tf_data["Daily"]["dates"],
            range=get_range_args("Daily", "1Y")["xaxis2.range"],
            nticks=12,
            **grid_style,
        ),
        updatemenus=[
            dict(
                type="buttons",
                direction="right",
                x=1.0,
                y=1.1,
                xanchor="right",
                yanchor="top",
                showactive=True,
                bgcolor="rgba(255,255,255,0.08)",
                font=dict(color="white", size=12),
                buttons=tf_buttons,
            )
        ],
        height=850,
        showlegend=False,
        margin=dict(l=60, r=60, t=100, b=60),
        plot_bgcolor="#131722",
        paper_bgcolor="#131722",
    )

    fig.update_yaxes(title_text="Price ($)", row=1, col=1, tickprefix="$", side="right", **grid_style)
    fig.update_yaxes(title_text="Volume ($)", row=2, col=1, tickformat="$.2s", side="right", **grid_style)

    # Disable floating mode for candlesticks to keep it clean
    fig.update_traces(selector=dict(type="candlestick"), hoverlabel=dict(bgcolor="#131722"))

    print(f"Launching pre-computed multi-timeframe dashboard for {symbol}...")
    fig.show()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python plot_history.py <SYMBOL>")
        sys.exit(1)
    
    symbol = sys.argv[1].upper()
    plot_interactive_history(symbol)
