let pageContext = {
  url: '',
  title: '',
  content: ''
};

export const setPageContext = (context) => {
  pageContext = context;
};

export const getPageContext = () => {
  return pageContext;
};
