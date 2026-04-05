import sys
import os
import polars as pl
import yfinance as yf

# Save to dedicated temporary directory
OUTPUT_DIR = "/tmp/yahoo_data"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def generate_csv(symbol: str, period: str = "max"):
    """Fetches full available history and saves OHLC + volumes to a CSV in /tmp."""
    hist = yf.Ticker(symbol).history(period=period)

    if hist.empty:
        return

    # Process metrics using Polars, keeping OHLC for technical charting
    df = pl.from_pandas(hist.reset_index())
    df = df.select(
        date=pl.col("Date"),
        ticker=pl.lit(symbol),
        open=pl.col("Open"),
        high=pl.col("High"),
        low=pl.col("Low"),
        close=pl.col("Close"),
        nominal_volume=pl.col("Volume"),
        quote_volume=pl.col("Volume") * pl.col("Close"),
    )

    # Save to Symbol-specific file
    path = os.path.join(OUTPUT_DIR, f"{symbol}_history.csv")
    df.write_csv(path)
    print(f"[{symbol}] Saved {len(df)} rows to {path}")


def main():
    tickers = sys.argv[1:] if len(sys.argv) > 1 else ["VOO", "GOOGL"]
    for symbol in tickers:
        generate_csv(symbol)


if __name__ == "__main__":
    main()
