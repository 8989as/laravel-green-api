import React from 'react';
import { useTranslation } from 'react-i18next';
import FilterSidebar from './FilterSidebar';
import './SideBar.css';

const SideBar = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const plantOptions = [
    { label: 'أشجار', value: 'trees' },
    { label: 'شجيرات', value: 'shrubs' },
    { label: 'نباتات داخلية', value: 'indoor' },
    { label: 'نباتات خارجية', value: 'outdoor' },
    { label: 'نباتات شتوية', value: 'winter' },
    { label: 'نباتات صيفية', value: 'summer' },
  ];
  const colorOptions = [
    { label: 'برتقالى', value: '#F99B18' },
    { label: 'بنفسجى', value: '#A20CD4' },
    { label: 'أحمر', value: '#D40C0C' },
    { label: 'روز', value: '#FF96B2' },
  ];
  const sizeOptions = [
    { label: 'صغير', value: 'small' },
    { label: 'متوسط', value: 'medium' },
    { label: 'كبير', value: 'large' },
  ];

  const sections = [
    {
      key: 'plantType',
      title: 'تصنيف النباتات',
      type: 'checkbox',
      options: plantOptions,
    },
    {
      key: 'color',
      title: 'اللون',
      type: 'color',
      options: colorOptions,
    },
    {
      key: 'size',
      title: 'حجم النبات',
      type: 'checkbox',
      options: sizeOptions,
    },
    // Add price section if needed
  ];

  const [selectedCheckboxes, setSelectedCheckboxes] = React.useState({});
  const [selectedColors, setSelectedColors] = React.useState([]);

  const handleCheckboxChange = (sectionKey, value) => {
    setSelectedCheckboxes((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };
  const handleColorSelect = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  return (
    <div className="sidebar-container container-fluid p-0">
      <div className="row">
        <div className="col-12">
          <FilterSidebar
            isRTL={isRTL}
            title="تصفية المنتاجات"
            sections={sections}
            selectedCheckboxes={selectedCheckboxes}
            selectedColors={selectedColors}
            onCheckboxChange={handleCheckboxChange}
            onColorSelect={handleColorSelect}
            actionLabel="تصفية المنتاجات"
            onAction={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default SideBar;