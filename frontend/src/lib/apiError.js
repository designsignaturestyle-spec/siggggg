function formatApiError(detail, fallback) {
  if (detail == null) return fallback || "Something went wrong.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return (
      detail
        .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
        .filter(Boolean)
        .join(" ") || fallback
    );
  }
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default formatApiError;
