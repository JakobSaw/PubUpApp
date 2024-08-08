export default (category, t) => {
  if (category.includes('urkneipe')) {
    return t('category_pub');
  } else if (category.includes('alternativ')) {
    return t('category_yuc');
  } else if (category.includes('cozy')) {
    return t('category_cozy');
  } else if (category.includes('dancing')) {
    return t('category_dancing');
  } else if (category.includes('irish')) {
    return t('category_irish_pub');
  } else if (category.includes('garten')) {
    return t('category_garden');
  } else if (category.includes('beach')) {
    return t('category_beach_roof');
  } else if (category.includes('classy')) {
    return t('category_classy');
  } else if (category.substring(0, 3) === 'hh-') {
    return 'HopfenHelden'
  } else if (category === 'bierothek') {
    return 'Bierothek®'
  }
  return null;
};
