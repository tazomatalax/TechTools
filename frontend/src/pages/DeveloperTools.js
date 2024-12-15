import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Icon from '@mdi/react';
import { mdiSwapHorizontal } from '@mdi/js';
import {
  Calculate as BaseConverterIcon,
  Search as MagnifyIcon,
  ManageSearch as RegexIcon,
  DataObject as JsonIcon,
  Palette as ColorIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const ToolCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.main,
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
}));

const tools = [
  {
    title: "Multi-Base Calculator",
    description: "Perform arithmetic and bitwise operations in decimal, binary, and hexadecimal",
    iconComponent: BaseConverterIcon,
    path: '/developer-tools/base-converter',
    tags: ['binary', 'hex', 'decimal', 'conversion']
  },
  {
    title: "Byte Converter",
    description: "Convert between raw bytes and various numeric types",
    icon: mdiSwapHorizontal,
    path: '/developer-tools/byte-converter',
    tags: ['bytes', 'integers', 'floats', 'conversion']
  },
  {
    title: "Binary Viewer",
    description: "View and analyze binary data in multiple formats",
    iconComponent: MagnifyIcon,
    path: '/developer-tools/binary-viewer',
    tags: ['binary', 'hex', 'data', 'analysis']
  },
  {
    title: "Regex Tester",
    description: "Test and debug regular expressions with real-time matching",
    iconComponent: RegexIcon,
    path: '/developer-tools/regex-tester',
    tags: ['regex', 'pattern', 'matching', 'testing']
  },
  {
    title: "JSON Formatter",
    description: "Format, validate, and analyze JSON data structures",
    iconComponent: JsonIcon,
    path: '/developer-tools/json-formatter',
    tags: ['json', 'formatting', 'validation']
  },
  {
    title: "Color Picker",
    description: "Select and convert colors between different formats",
    iconComponent: ColorIcon,
    path: '/developer-tools/color-picker',
    tags: ['color', 'rgb', 'hex', 'hsl']
  },
  {
    title: "Image Converter",
    description: "Convert images between different formats and analyze image data",
    iconComponent: ImageIcon,
    path: '/developer-tools/image-converter',
    tags: ['image', 'conversion', 'format']
  }
];

function DeveloperTools() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Developer Tools
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Essential utilities for software development and data manipulation
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.title}>
            <ToolCard component={RouterLink} to={tool.path} sx={{ textDecoration: 'none' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <IconWrapper>
                  {tool.iconComponent ? (
                    <tool.iconComponent sx={{ fontSize: 'inherit' }} />
                  ) : (
                    <Icon path={tool.icon} size={2} />
                  )}
                </IconWrapper>
                <Typography variant="h5" component="h2" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {tool.description}
                </Typography>
              </CardContent>
            </ToolCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default DeveloperTools;
