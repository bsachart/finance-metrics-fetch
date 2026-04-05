"""Project-specific exceptions."""

from __future__ import annotations


class FinanceMetricsFetchError(Exception):
    """Base project exception."""


class ConfigValidationError(FinanceMetricsFetchError):
    """Raised when ticker configuration is invalid."""
