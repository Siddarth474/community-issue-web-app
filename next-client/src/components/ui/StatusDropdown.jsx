import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

const StatusDropdown = ({ value, onChange, list, label }) => {
  return (
    <div >
      <Select value={value} onValueChange={(val) => {
        const selected = list.find(item => item.name === val);
        onChange(selected);
      }}  >
        <SelectTrigger className="border px-4 bg-white border-gray-400 text-black  dark:text-gray-100 focus:ring-1 
        focus:ring-orange-500 focus:border-orange-500 w-full" >
          
          <SelectValue placeholder={label} className="placeholder:text-black" />
        </SelectTrigger>
        <SelectContent className="z-[99999] dark:bg-zinc-900">
          {list.map((item) => (
            <SelectItem key={item.name} value={item.name} className="hover:bg-gray-300">
             {item.icon} {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default StatusDropdown;
