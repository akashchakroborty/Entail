import { Error as ErrorIcon, Warning } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import type { ReactElement } from "react";

export type ErrorSeverity = "error" | "warning" | "info";

interface ErrorStateProps {
  title?: string;
  message?: string;
  severity?: ErrorSeverity;
  height?: string | number;
  actionLabel?: string;
  onActionClick?: () => void;
  icon?: ReactElement;
  children?: React.ReactNode;
}

const getErrorIcon = (
  severity: ErrorSeverity,
  icon?: ReactElement
): ReactElement =>
  icon ||
  (severity === "error" ? (
    <ErrorIcon fontSize="large" color="error" />
  ) : severity === "warning" ? (
    <Warning fontSize="large" color="warning" />
  ) : (
    <Warning fontSize="large" color="info" />
  ));

const getErrorTitle = (severity: ErrorSeverity, title?: string): string =>
  title ||
  (severity === "error"
    ? "Error Occurred"
    : severity === "warning"
    ? "Warning"
    : "Information");

const getErrorMessage = (severity: ErrorSeverity, message?: string): string =>
  message ||
  (severity === "error"
    ? "There was a problem loading the data. Please try again."
    : severity === "warning"
    ? "There might be an issue with the current data."
    : "Something needs your attention.");

const getButtonColor = (severity: ErrorSeverity) =>
  severity === "error"
    ? "error"
    : severity === "warning"
    ? "warning"
    : "primary";

const getBorderColor = (severity: ErrorSeverity, theme: any) =>
  severity === "error"
    ? theme.palette.error.main
    : severity === "warning"
    ? theme.palette.warning.main
    : theme.palette.info.main;

export function ErrorState({
  title,
  message,
  severity = "error",
  height = "auto",
  actionLabel,
  onActionClick,
  icon,
  children,
}: ErrorStateProps): ReactElement {
  const theme = useTheme();

  const errorIcon = getErrorIcon(severity, icon);
  const errorTitle = getErrorTitle(severity, title);
  const errorMessage = getErrorMessage(severity, message);

  return (
    <Card
      sx={{
        height,
        border: `1px solid ${getBorderColor(severity, theme)}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
      aria-live="assertive"
      role="alert"
    >
      <Alert
        severity={severity}
        sx={{
          borderRadius: 0,
          alignItems: "center",
          "& .MuiAlert-icon": {
            fontSize: "1.5rem",
            mr: 1,
          },
        }}
      >
        <Typography variant="subtitle1" component="h3">
          {errorTitle}
        </Typography>
      </Alert>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            py: 3,
          }}
        >
          <Box sx={{ mb: 2 }}>{errorIcon}</Box>
          <Typography
            variant="body1"
            gutterBottom
            sx={{ mb: 2, maxWidth: 450, mx: "auto" }}
          >
            {errorMessage}
          </Typography>
          {children}
          {actionLabel && onActionClick && (
            <Button
              variant="contained"
              color={getButtonColor(severity)}
              onClick={onActionClick}
              sx={{ mt: 2 }}
            >
              {actionLabel}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
