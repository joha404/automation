import { dotPulse } from 'ldrs'
dotPulse.register()
const ButtonLoader = ({ color = "#FFF" }) => 
{
  return (
    <div className="flex h-auto w-full items-center justify-center">
      <l-dot-pulse
        size="30"
        stroke="4"
        stroke-length="0.15"
        speed="1.4"
        color={color}
      ></l-dot-pulse>
    </div>
  )
}

export default ButtonLoader