import { Button } from "../../components";
import { CSVLink } from "react-csv";

type ExportCsvButtonProps = {
  data: object[];
  filename: string;
};

export default function ExportCsvButton({ data, filename }: ExportCsvButtonProps) {
  return (
    <CSVLink data={data} filename={filename} separator=";" enclosingCharacter={`"`} asyncOnClick={true}>
      <Button variant="success">
        <i className="bi bi-file-earmark-spreadsheet me-2" />
        Exportar CSV
      </Button>
    </CSVLink>
  );
}
