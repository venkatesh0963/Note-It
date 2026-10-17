// Check if a point is near a line segment
export const isPointNearLine = (x, y, x1, y1, x2, y2, threshold = 6) => {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  if (len_sq !== 0) param = dot / len_sq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy) < threshold;
};

// Check if point is inside a rectangle
export const isPointInRect = (x, y, rectX, rectY, width, height) => {
  const minX = Math.min(rectX, rectX + width);
  const maxX = Math.max(rectX, rectX + width);
  const minY = Math.min(rectY, rectY + height);
  const maxY = Math.max(rectY, rectY + height);

  return x >= minX && x <= maxX && y >= minY && y <= maxY;
};

// Check if point is inside a circle/ellipse
export const isPointInCircle = (x, y, rectX, rectY, width, height) => {
  const radiusX = Math.abs(width / 2);
  const radiusY = Math.abs(height / 2);
  if (radiusX === 0 || radiusY === 0) return false;

  const centerX = rectX + width / 2;
  const centerY = rectY + height / 2;

  const dx = (x - centerX) / radiusX;
  const dy = (y - centerY) / radiusY;

  return dx * dx + dy * dy <= 1;
};

// Get bounding box for an element
export const getBoundingBox = (el) => {
  if (!el) return null;
  if (['rectangle', 'circle', 'line', 'table'].includes(el.type)) {
    const minX = Math.min(el.x, el.x + (el.width || 0));
    const maxX = Math.max(el.x, el.x + (el.width || 0));
    const minY = Math.min(el.y, el.y + (el.height || 0));
    const maxY = Math.max(el.y, el.y + (el.height || 0));
    return { minX, minY, maxX, maxY };
  }
  if (el.type === 'text') {
    const fontSize = Math.max(14, (el.strokeWidth || 2) * 10);
    const approxWidth = (el.text || '').length * (fontSize * 0.6);
    return {
      minX: el.x,
      minY: el.y,
      maxX: el.x + Math.max(approxWidth, 20),
      maxY: el.y + fontSize,
    };
  }
  if ((el.type === 'pencil' || el.type === 'eraser') && el.points && el.points.length > 0) {
    const xs = el.points.map((p) => p.x);
    const ys = el.points.map((p) => p.y);
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    };
  }
  return null;
};

// Check if clicked on a resize handle
export const getResizeHandle = (x, y, element) => {
  const box = getBoundingBox(element);
  if (!box) return null;
  const { minX, minY, maxX, maxY } = box;
  const hs = 12; // Handle hit target size

  if (isPointInRect(x, y, minX - hs / 2, minY - hs / 2, hs, hs)) return 'tl';
  if (isPointInRect(x, y, maxX - hs / 2, minY - hs / 2, hs, hs)) return 'tr';
  if (isPointInRect(x, y, minX - hs / 2, maxY - hs / 2, hs, hs)) return 'bl';
  if (isPointInRect(x, y, maxX - hs / 2, maxY - hs / 2, hs, hs)) return 'br';

  return null;
};

export const getElementAtPosition = (x, y, elements) => {
  // Search from top to bottom (last drawn layer first)
  for (let i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];

    switch (element.type) {
      case 'rectangle':
      case 'table':
        if (isPointInRect(x, y, element.x, element.y, element.width, element.height)) {
          return { ...element, index: i };
        }
        break;
      case 'circle':
        if (isPointInCircle(x, y, element.x, element.y, element.width, element.height)) {
          return { ...element, index: i };
        }
        break;
      case 'line':
        if (
          isPointNearLine(
            x,
            y,
            element.x,
            element.y,
            element.x + element.width,
            element.y + element.height,
            (element.strokeWidth || 2) + 4
          )
        ) {
          return { ...element, index: i };
        }
        break;
      case 'pencil':
      case 'eraser':
        if (element.points && element.points.length > 1) {
          for (let j = 0; j < element.points.length - 1; j++) {
            const p1 = element.points[j];
            const p2 = element.points[j + 1];
            if (isPointNearLine(x, y, p1.x, p1.y, p2.x, p2.y, (element.strokeWidth || 2) + 5)) {
              return { ...element, index: i };
            }
          }
        }
        break;
      case 'text': {
        const box = getBoundingBox(element);
        if (box && isPointInRect(x, y, box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY)) {
          return { ...element, index: i };
        }
        break;
      }
      default:
        break;
    }
  }
  return null;
};
