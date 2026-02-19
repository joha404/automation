import { useTheme } from '@/hooks/custom/useTheme';
import { cn } from '@/lib/utils'

const CommonTitle = ({
  className ="", 
  variant="large", 
  children
}) => 
{
    const { theme } = useTheme();
  const variants = 
  {
    large: "xl:text-[40px] lg:text-4xl text-3xl leading-[120%] leading-8",
    regular: "xl:text-[34px] lg:text-3xl text-2xl ",
    small: "md:text-[22px] sm:text-xl text-lg"
  }
  const baseClass = `font-bold ${theme === "dark" ? "text-lighterGrey" : "text-darkGrey"}`
  return (
    <p className={cn(baseClass, className, variants[variant])}>{children}</p>
  )
}

export default CommonTitle