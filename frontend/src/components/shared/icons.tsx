import type { LucideIcon, LucideProps } from "lucide-react";

interface IconProps extends LucideProps {
    icon: LucideIcon;
}

const Icon = ({ icon: IconComponent, ...props }: IconProps) => {
    return <IconComponent {...props} />;
};

export default Icon;
