/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type CarburantsCreateFormInputValues = {
    level?: number;
};
export declare type CarburantsCreateFormValidationValues = {
    level?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CarburantsCreateFormOverridesProps = {
    CarburantsCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    level?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CarburantsCreateFormProps = React.PropsWithChildren<{
    overrides?: CarburantsCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CarburantsCreateFormInputValues) => CarburantsCreateFormInputValues;
    onSuccess?: (fields: CarburantsCreateFormInputValues) => void;
    onError?: (fields: CarburantsCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CarburantsCreateFormInputValues) => CarburantsCreateFormInputValues;
    onValidate?: CarburantsCreateFormValidationValues;
} & React.CSSProperties>;
export default function CarburantsCreateForm(props: CarburantsCreateFormProps): React.ReactElement;
