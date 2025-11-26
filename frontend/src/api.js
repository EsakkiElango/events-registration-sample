const API = async (path, opts={}) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if(token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch('http://localhost:3001' + path, { headers, ...opts });
  if(!res.ok) throw await res.json();
  return res.json();
};
export default API;
