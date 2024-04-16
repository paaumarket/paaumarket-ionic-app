import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const useHookForm = ({ schema, ...props }) =>
    useForm({
        resolver: yupResolver(schema),
        ...props,
    });

export default useHookForm;
