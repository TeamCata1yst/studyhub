export function FormMessage({ message }: { message: URLSearchParams }) {
  return (
    <div className="flex flex-col gap-2 w-full text-sm">
      {message.has("success") && (
        <div className="text-foreground border-l-2 border-foreground my-2 px-4">
          {message.get("success")}
        </div>
      )}
      {message.has("error") && (
        <div className="text-destructive border-l-2 border-destructive my-2 px-4">
          {message.get("error")}
        </div>
      )}
      {message.has("message") && (
        <div className="text-foreground border-l-2 px-4 my-2">
          {message.get("message")}
        </div>
      )}
    </div>
  );
}
