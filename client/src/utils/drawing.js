export const drawElement = (ctx, element) => {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = element.color || '#000000';
  ctx.lineWidth = element.strokeWidth || 2;
  ctx.fillStyle = element.fillColor || 'transparent';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const w = element.strokeWidth || 2;
  switch (element.strokeStyle) {
    case 'dashed':
      ctx.setLineDash([w * 3, w * 3]);
      break;
    case 'dotted':
      ctx.setLineDash([1, w * 2]);
      break;
    case 'dash-dot':
      ctx.setLineDash([w * 3, w * 2, 1, w * 2]);
      break;
    default:
      ctx.setLineDash([]); // solid
  }

  switch (element.type) {
    case 'pencil':
    case 'eraser':
      if (element.points && element.points.length > 0) {
        ctx.moveTo(element.points[0].x, element.points[0].y);
        for (let i = 1; i < element.points.length; i++) {
          ctx.lineTo(element.points[i].x, element.points[i].y);
        }
        if (element.type === 'eraser') {
          ctx.strokeStyle = '#ffffff'; // White canvas eraser
          ctx.lineWidth = (element.strokeWidth || 2) * 6;
        }
        ctx.stroke();
      }
      break;

    case 'line':
      ctx.moveTo(element.x, element.y);
      ctx.lineTo(element.x + element.width, element.y + element.height);
      ctx.stroke();
      break;

    case 'rectangle': {
      const rectX = Math.min(element.x, element.x + element.width);
      const rectY = Math.min(element.y, element.y + element.height);
      const rectW = Math.abs(element.width);
      const rectH = Math.abs(element.height);

      if (element.borderRadius && element.borderRadius > 0 && ctx.roundRect) {
        const maxRadius = Math.min(rectW, rectH) / 2;
        const radius = Math.min(element.borderRadius, maxRadius);
        ctx.roundRect(rectX, rectY, rectW, rectH, radius);
      } else {
        ctx.rect(element.x, element.y, element.width, element.height);
      }
      if (element.fillColor && element.fillColor !== 'transparent') {
        ctx.fill();
      }
      ctx.stroke();
      break;
    }

    case 'table': {
      const rectX = Math.min(element.x, element.x + element.width);
      const rectY = Math.min(element.y, element.y + element.height);
      const rectW = Math.abs(element.width);
      const rectH = Math.abs(element.height);

      ctx.rect(rectX, rectY, rectW, rectH);
      if (element.fillColor && element.fillColor !== 'transparent') {
        ctx.fill();
      }
      ctx.stroke();

      const rows = Math.max(1, element.rows || 3);
      const cols = Math.max(1, element.cols || 3);

      ctx.beginPath();
      // Draw row dividers
      for (let i = 1; i < rows; i++) {
        const y = rectY + (rectH / rows) * i;
        ctx.moveTo(rectX, y);
        ctx.lineTo(rectX + rectW, y);
      }
      // Draw column dividers
      for (let i = 1; i < cols; i++) {
        const x = rectX + (rectW / cols) * i;
        ctx.moveTo(x, rectY);
        ctx.lineTo(x, rectY + rectH);
      }
      ctx.stroke();
      break;
    }

    case 'circle': {
      const radiusX = Math.abs(element.width / 2);
      const radiusY = Math.abs(element.height / 2);
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      if (radiusX > 0 && radiusY > 0) {
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        if (element.fillColor && element.fillColor !== 'transparent') {
          ctx.fill();
        }
        ctx.stroke();
      }
      break;
    }

    case 'text':
      ctx.font = `${Math.max(14, (element.strokeWidth || 2) * 10)}px 'Inter', sans-serif`;
      ctx.fillStyle = element.color || '#000000';
      ctx.textBaseline = 'top';
      ctx.fillText(element.text || '', element.x, element.y);
      break;

    default:
      break;
  }
  ctx.restore();
};

export const redrawCanvas = (canvas, ctx, elements) => {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Fill white background for canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Redraw all elements in layer order
  elements.forEach((element) => {
    drawElement(ctx, element);
  });
};
