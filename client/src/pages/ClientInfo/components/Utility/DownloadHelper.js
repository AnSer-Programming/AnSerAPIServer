// Very small helper – extend later with XLSX / DOCX utilities.
export const downloadJSON = (data, filename = 'data.json') => {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download failed:', err);
  }
};
