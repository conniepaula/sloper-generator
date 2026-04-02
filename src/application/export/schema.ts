import * as z from "zod";

export const exportSchema = z.object({
  size: z
    .enum(["a0", "a4", "letter"], "Invalid page size selected.")
    .meta({ title: "Page Size" }),
  fileName: z
    .string()
    .superRefine((value, ctx) => {
      if (value.includes(".")) {
        ctx.addIssue({
          code: "custom",
          message:
            'File extension ".pdf" is already included and can’t be changed.',
          input: value,
        });
        return;
      }

      if (!/^(?![ -])(?!.*[ -]$)(?!.* {2})[a-zA-Z0-9 _-]+$/.test(value)) {
        ctx.addIssue({
          code: "custom",
          message:
            "Use only letters, numbers, spaces, hyphens, or underscores. Don’t start or end with a space or hyphen.",
          input: value,
        });
      }
    })
    .meta({ title: "File Name" }),
});
