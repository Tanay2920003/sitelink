import BookLoader from "@/components/BookLoader/BookLoader";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <BookLoader />
    </div>
  );
}
