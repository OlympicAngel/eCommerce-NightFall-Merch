import * as yup from "yup";

export const passwordValidation = yup.string()
    .required("חייב להזין סיסמה.")
    .min(4, "חסרים תווים - חייב לפחות 4 תווים")
    .max(32, "סיסמה ארוכה מידי - המקסימום זה 32 תווים")

export const passwordValidationOption = yup.string()
    .min(4, "חסרים תווים - חייב לפחות 4 תווים")
    .max(32, "סיסמה ארוכה מידי - המקסימום זה 32 תווים")

export const emailValidation = yup.string()
    .required("חייב להזין אמייל.")
    .email("אימייל לא תקין.")