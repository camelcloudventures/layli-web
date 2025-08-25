import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import clsx from "clsx";
import BtnLoader from "./btn-loader";

type IProps = {
  className?: string;
  label: string;
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  isDisabled?: boolean;
};
export default function SubmitBtn({
  variant,
  className,
  label,
  isDisabled,
}: IProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={isDisabled}
      variant={variant}
      className={clsx(
        className
        // pending ? 'bg-opacity-50' : '',
        // isDisabled ? '' : '',
      )}
    >
      {pending ? <BtnLoader /> : label}
    </Button>
  );
}
