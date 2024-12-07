import React from 'react';
import { Paper, Typography } from '@mui/material';

const AboutToolSection = ({ title, description, features, useCases }) => {
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        About this tool
      </Typography>
      <Typography variant="body1" paragraph>
        {description}
      </Typography>
      
      {features && (
        <>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            Key Features:
          </Typography>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>
                <Typography>
                  {typeof feature === 'object' ? (
                    <>
                      <strong>{feature.title}:</strong>
                      {feature.items ? (
                        <ul>
                          {feature.items.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        ' ' + feature.description
                      )}
                    </>
                  ) : (
                    feature
                  )}
                </Typography>
              </li>
            ))}
          </ul>
        </>
      )}
      
      {useCases && (
        <>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
            Use Cases:
          </Typography>
          <Typography variant="body1">
            {useCases.map((useCase, index) => (
              <React.Fragment key={index}>
                • {useCase}<br />
              </React.Fragment>
            ))}
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default AboutToolSection;
