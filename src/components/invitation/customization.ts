export function invitationFontStack(value?: string | null) {
  switch (value) {
    case "serif":
      return 'Georgia, "Times New Roman", serif';
    case "sans":
      return 'Inter, ui-sans-serif, system-ui, sans-serif';
    case "display":
      return '"Trebuchet MS", "Arial Narrow", ui-sans-serif, sans-serif';
    default:
      return undefined;
  }
}

export function decorationOpacity(value?: string | null) {
  if (value === "minimal") return 0.45;
  if (value === "rich") return 1;
  return 0.75;
}
