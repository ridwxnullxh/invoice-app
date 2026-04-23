import App from "../App.jsx";

export function meta() {
  return [
    { title: "Invoice App" },
    { name: "description", content: "Manage your invoices — create, track, and organise payments." },
  ];
}

export default function Home() {
  return <App />;
}
