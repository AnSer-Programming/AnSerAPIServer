import React from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	Grid,
	InputAdornment,
	Paper,
	Stack,
	TextField,
	Typography,
	Tooltip,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const coercePercent = (value) => {
	if (value == null) return '';
	const next = String(value).replace(/[^0-9.]/g, '');
	if (!next) return '';
	const numeric = Math.min(100, Math.max(0, parseFloat(next)));
	if (Number.isNaN(numeric)) return '';
	return numeric.toString();
};

const CallVolumeSection = ({ value = {}, onChange = () => {}, errors = {} }) => {
	const theme = useTheme();
	const merged = {
		avgDaily: '',
		peakWindow: '',
		overnightPct: '',
		notes: '',
		...value,
	};

	const handleChange = (field, formatter) => (event) => {
		const raw = event.target.value;
		const next = typeof formatter === 'function' ? formatter(raw) : raw;
		onChange({ ...merged, [field]: next });
	};

	const borderColor = alpha(theme.palette.primary.main, 0.18);
	const helperColor = theme.palette.text.secondary;

	return (
		<Paper
			elevation={0}
			sx={{
				p: { xs: 3, md: 4 },
				borderRadius: 3,
				border: `1px solid ${borderColor}`,
				bgcolor: theme.palette.mode === 'dark'
					? alpha(theme.palette.primary.main, 0.1)
					: alpha(theme.palette.primary.light, 0.08),
			}}
		>
			<Stack spacing={2} sx={{ mb: 3 }}>
				<Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
					Call Volume Snapshot
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Share how busy the phones get so our scheduling team can stage the right coverage from day one.
				</Typography>
				<Alert
					severity="info"
					icon={false}
					sx={{
						borderRadius: 2,
						bgcolor: alpha(theme.palette.info.main, 0.08),
						color: theme.palette.info.main,
						fontWeight: 600,
					}}
				>
					Consult Ryan if you aren’t sure which numbers to use — he can translate raw totals into staffing targets.
				</Alert>
			</Stack>

			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<TextField
						label="Average daily call volume"
						placeholder="e.g., 45"
						value={merged.avgDaily}
						onChange={handleChange('avgDaily', (raw) => raw.replace(/[^0-9]/g, '').slice(0, 4))}
						fullWidth
						inputProps={{ inputMode: 'numeric', maxLength: 4 }}
						error={Boolean(errors.avgDaily)}
						helperText={errors.avgDaily || 'Approximate daily total across weekdays.'}
					/>
				</Grid>

				<Grid item xs={12} md={4}>
					<TextField
						label="Peak times"
						placeholder="Example: Mondays 7–10 AM, lunch rush"
						value={merged.peakWindow}
						onChange={handleChange('peakWindow')}
						fullWidth
						error={Boolean(errors.peakWindow)}
						helperText={errors.peakWindow || 'When do surges typically occur?'}
					/>
				</Grid>

				<Grid item xs={12} md={4}>
					<TextField
						label="Overnight percentage"
						placeholder="e.g., 12"
						value={merged.overnightPct}
						onChange={handleChange('overnightPct', coercePercent)}
						fullWidth
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<Tooltip title="Estimate of total calls between 10 PM and 6 AM.">
													<HelpOutlineIcon fontSize="small" sx={{ color: helperColor }} />
												</Tooltip>
											</InputAdornment>
										),
									}}
						error={Boolean(errors.overnightPct)}
						helperText={errors.overnightPct || 'Share a % of calls that arrive overnight.'}
					/>
				</Grid>

				<Grid item xs={12}>
					<TextField
						label="Additional notes"
						placeholder="Seasonal spikes, marketing pushes, outage expectations, etc."
						value={merged.notes}
						onChange={handleChange('notes')}
						fullWidth
						multiline
						minRows={3}
						error={Boolean(errors.notes)}
						helperText={errors.notes || 'Optional context so supervisors can forecast coverage.'}
					/>
				</Grid>
			</Grid>
		</Paper>
	);
};

CallVolumeSection.propTypes = {
	value: PropTypes.shape({
		avgDaily: PropTypes.string,
		peakWindow: PropTypes.string,
		overnightPct: PropTypes.string,
		notes: PropTypes.string,
	}),
	onChange: PropTypes.func,
	errors: PropTypes.object,
};

export default CallVolumeSection;
