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
  onClick?: () => void;
};
export default function SubmitBtn({
  variant,
  className,
  label,
  isDisabled,
  onClick,
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
      onClick={onClick}
    >
      {pending ? <BtnLoader /> : label}
    </Button>
  );
}
