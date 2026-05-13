import Link from "next/link";

function ReturnBackButton() {
  return (
    <Link
      href="/"
      className="p-2 bg-brandMagenta bg-opacity-25 rounded-md font-semibold text-md hover:bg-brandMagenta bg-opacity-75"
    >
      Повернутися на головну
    </Link>
  );
}

export default ReturnBackButton;
