import { Product } from '../types';

/**
 * Exports products in standard Shopify CSV format
 */
export function exportProductsToShopifyCSV(products: Product[]): string {
  const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Standardized Product Type',
    'Custom Product Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Variant SKU',
    'Variant Grams',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Image Src',
    'Image Position',
    'Image Alt Text',
    'Gift Card',
    'SEO Title',
    'SEO Description',
    'Google Shopping / Google Product Category',
    'Google Shopping / Gender',
    'Google Shopping / Age Group',
    'Google Shopping / MPN',
    'Google Shopping / Condition',
    'Google Shopping / Custom Product',
    'Google Shopping / Custom Label 0',
    'Google Shopping / Custom Label 1',
    'Google Shopping / Custom Label 2',
    'Google Shopping / Custom Label 3',
    'Google Shopping / Custom Label 4',
    'Variant Image',
    'Variant Weight Unit',
    'Variant Tax Code',
    'Cost per item',
    'Price / International',
    'Compare At Price / International',
    'Status'
  ];

  const escapeCsv = (str: string | number | undefined | null): string => {
    if (str === undefined || str === null) return '';
    const text = String(str);
    if (text.includes(',') || text.includes('"') || text.includes('\n') || text.includes('\r')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const rows: string[] = [headers.join(',')];

  products.forEach((p) => {
    const handle = p.shopifyHandle || p.slug || p.id;
    const bodyHtml = `<p>${p.description}</p><ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>`;
    const vendor = 'TOUBA MADIYINA ELECTRONIC';
    const productType = p.category;
    const tags = p.tags.join(', ');
    const published = 'TRUE';
    const option1Name = 'Title';
    const option1Value = 'Default Title';
    const sku = p.sku;
    const qty = p.stockCount || 10;
    const price = p.price;
    const compareAtPrice = p.compareAtPrice || '';
    const imageSrc = p.images[0] || '';
    const seoTitle = `${p.title} | TOUBA MADIYINA Dakar`;
    const seoDescription = p.description.slice(0, 160);

    const row = [
      escapeCsv(handle),
      escapeCsv(p.title),
      escapeCsv(bodyHtml),
      escapeCsv(vendor),
      escapeCsv(''),
      escapeCsv(productType),
      escapeCsv(tags),
      escapeCsv(published),
      escapeCsv(option1Name),
      escapeCsv(option1Value),
      escapeCsv(sku),
      escapeCsv(500),
      escapeCsv('shopify'),
      escapeCsv(qty),
      escapeCsv('deny'),
      escapeCsv('manual'),
      escapeCsv(price),
      escapeCsv(compareAtPrice),
      escapeCsv('TRUE'),
      escapeCsv('FALSE'),
      escapeCsv(imageSrc),
      escapeCsv(1),
      escapeCsv(p.title),
      escapeCsv('FALSE'),
      escapeCsv(seoTitle),
      escapeCsv(seoDescription),
      '', '', '', '', escapeCsv('new'), '', '', '', '', '', '',
      escapeCsv(imageSrc),
      escapeCsv('g'),
      '', '', '', '',
      escapeCsv('active')
    ];

    rows.push(row.join(','));

    // Additional images rows if any
    for (let i = 1; i < p.images.length; i++) {
      const extraRow = [
        escapeCsv(handle),
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        escapeCsv(p.images[i]),
        escapeCsv(i + 1),
        escapeCsv(p.title),
        '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', ''
      ];
      rows.push(extraRow.join(','));
    }
  });

  return rows.join('\r\n');
}

export function downloadFile(content: string | Blob, fileName: string, contentType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
