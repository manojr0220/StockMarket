export default function Logo({ fontSize }: { fontSize?: any }) {
  return (
    <div
      style={{ fontSize: fontSize, fontWeight: "bold",color:"#1d3d60" }}
      className={`text-green-800`}
    >
      LezDo TechMed
    </div>
  );
}
