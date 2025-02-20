// src/app/swagger-ui/page.js
'use client'; // Make it a client component

import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css'; // Import default styles

function SwaggerUIPage() {
  return (
    <SwaggerUI url="swagger.json" />
  );
}

export default SwaggerUIPage;