"use client";
import FileSaver from "file-saver";
import { url } from "inspector";
import { Download } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";

interface myUrl {
  url: string;
}

const DownloadButton = ({ url }: myUrl) => {
  const handleDownload = () => {
    FileSaver.saveAs(url, `${new Date().toISOString()}.png`);
  };
  return (
    <Button className="absolute right-0 top-0" onClick={handleDownload}>
      <Download />
    </Button>
  );
};

export default DownloadButton;
