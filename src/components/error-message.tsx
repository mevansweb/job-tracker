export const ErrorMessage = ({ errors }: { errors: string[] }) => (
  <div>
    Error: Please enter these missing fields:
    <ul>
      {errors.map((err) => (
        <li className="font-bold text-red-500">{err}</li>
      ))}
    </ul>
  </div>
)
