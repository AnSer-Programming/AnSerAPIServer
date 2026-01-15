import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Typography,
  Box,
  Divider,
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material';
import { Download, Description, TableChart, Code } from '@mui/icons-material';

/**
 * Advanced data export system with multiple formats and customization options
 */
const DataExportDialog = ({ 
  open, 
  onClose, 
  formData, 
  onExport 
}) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [selectedSections, setSelectedSections] = useState({
    companyInfo: true,
    answerCalls: true,
    officeReach: true,
    onCall: true,
    finalDetails: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { 
      value: 'json', 
      label: 'JSON', 
      icon: <Code />, 
      description: 'Structured data format for developers' 
    },
    { 
      value: 'csv', 
      label: 'CSV', 
      icon: <TableChart />, 
      description: 'Spreadsheet-compatible format' 
    },
    { 
      value: 'pdf', 
      label: 'PDF Report', 
      icon: <Description />, 
      description: 'Formatted document for sharing' 
    },
    { 
      value: 'xml', 
      label: 'XML', 
      icon: <Code />, 
      description: 'Structured markup format' 
    }
  ];

  const handleSectionToggle = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportData = {
        metadata: includeMetadata ? {
          exportDate: new Date().toISOString(),
          exportFormat,
          version: '1.0',
          sections: Object.keys(selectedSections).filter(key => selectedSections[key])
        } : null,
        data: Object.keys(selectedSections)
          .filter(key => selectedSections[key])
          .reduce((acc, section) => ({
            ...acc,
            [section]: formData[section] || {}
          }), {})
      };

      // Generate download based on format
      let downloadData, mimeType, fileName;

      switch (exportFormat) {
        case 'json':
          downloadData = JSON.stringify(exportData, null, 2);
          mimeType = 'application/json';
          fileName = `client-info-${Date.now()}.json`;
          break;

        case 'csv':
          downloadData = convertToCSV(exportData.data);
          mimeType = 'text/csv';
          fileName = `client-info-${Date.now()}.csv`;
          break;

        case 'pdf':
          downloadData = await generatePDF(exportData);
          mimeType = 'application/pdf';
          fileName = `client-info-report-${Date.now()}.pdf`;
          break;

        case 'xml':
          downloadData = convertToXML(exportData);
          mimeType = 'application/xml';
          fileName = `client-info-${Date.now()}.xml`;
          break;

        default:
          throw new Error('Unsupported export format');
      }

      // Create and trigger download
      const blob = new Blob([downloadData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (onExport) {
        onExport({ format: exportFormat, sections: selectedSections, fileName });
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data) => {
    const flattenObject = (obj, prefix = '') => {
      let flattened = {};
      for (let key in obj) {
        if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'));
        } else {
          flattened[prefix + key] = obj[key];
        }
      }
      return flattened;
    };

    const flatData = flattenObject(data);
    const headers = Object.keys(flatData);
    const csvContent = [
      headers.join(','),
      headers.map(header => `"${flatData[header] || ''}"`).join(',')
    ].join('\n');

    return csvContent;
  };

  const convertToXML = (data) => {
    const objectToXML = (obj, rootName = 'root') => {
      let xml = `<${rootName}>`;
      for (let key in obj) {
        if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          xml += objectToXML(obj[key], key);
        } else {
          xml += `<${key}>${obj[key] || ''}</${key}>`;
        }
      }
      xml += `</${rootName}>`;
      return xml;
    };

    return '<?xml version="1.0" encoding="UTF-8"?>\n' + objectToXML(data, 'clientInfo');
  };

  const generatePDF = async (data) => {
    // This would typically use a library like jsPDF or html2pdf
    // For now, return a simple text representation
    const pdfContent = `
CLIENT INFORMATION REPORT
Generated: ${new Date().toLocaleDateString()}

${Object.keys(data.data).map(section => `
=== ${section.toUpperCase()} ===
${JSON.stringify(data.data[section], null, 2)}
`).join('\n')}
    `;
    return pdfContent;
  };

  const selectedCount = Object.values(selectedSections).filter(Boolean).length;
  const totalSections = Object.keys(selectedSections).length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Download />
          <Typography variant="h6">Export Client Information</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {/* Export Format Selection */}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Export Format</FormLabel>
          <RadioGroup
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            {exportFormats.map((format) => (
              <Box key={format.value} sx={{ mb: 1 }}>
                <FormControlLabel
                  value={format.value}
                  control={<Radio />}
                  label={
                    <Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        {format.icon}
                        <Typography variant="body1">{format.label}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {format.description}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            ))}
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* Section Selection */}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">
            Sections to Include ({selectedCount}/{totalSections})
          </FormLabel>
          <FormGroup>
            {Object.keys(selectedSections).map((section) => (
              <FormControlLabel
                key={section}
                control={
                  <Checkbox
                    checked={selectedSections[section]}
                    onChange={() => handleSectionToggle(section)}
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2">
                      {section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Typography>
                    {formData[section] && Object.keys(formData[section]).length > 0 && (
                      <Chip size="small" label={`${Object.keys(formData[section]).length} fields`} />
                    )}
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {/* Options */}
        <FormControl component="fieldset">
          <FormLabel component="legend">Export Options</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                />
              }
              label="Include metadata (export date, version, etc.)"
            />
          </FormGroup>
        </FormControl>

        {/* Progress and Status */}
        {isExporting && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Generating {exportFormat.toUpperCase()} export...
            </Alert>
            <LinearProgress />
          </Box>
        )}

        {selectedCount === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Please select at least one section to export.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isExporting}>
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={selectedCount === 0 || isExporting}
          startIcon={<Download />}
        >
          {isExporting ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DataExportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  formData: PropTypes.object,
  onExport: PropTypes.func,
};

export default DataExportDialog;
