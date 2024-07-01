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
export declare type CarburantsUpdateFormInputValues = {
    level?: number;
};
export declare type CarburantsUpdateFormValidationValues = {
    level?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CarburantsUpdateFormOverridesProps = {
    CarburantsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    level?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CarburantsUpdateFormProps = React.PropsWithChildren<{
    overrides?: CarburantsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    carburants?: any;
    onSubmit?: (fields: CarburantsUpdateFormInputValues) => CarburantsUpdateFormInputValues;
    onSuccess?: (fields: CarburantsUpdateFormInputValues) => void;
    onError?: (fields: CarburantsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CarburantsUpdateFormInputValues) => CarburantsUpdateFormInputValues;
    onValidate?: CarburantsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CarburantsUpdateForm(props: CarburantsUpdateFormProps): React.ReactElement;
