
const FormInput = ({item, value, onChange}) => {
   return (
     <div className="flex flex-col gap-2">
       <label htmlFor={item} className="block text-xs font-semibold">
         {item}
       </label>
       <input
         type="text"
         value = {value}
         id={item}
         onChange={onChange}
         className="border rounded-sm w-full bg-stone-100 text-sm outline-none p-1.5 focus:outline-active"
       />
     </div>
   );
}

export default FormInput