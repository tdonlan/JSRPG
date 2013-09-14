
function getItemsFromCSV(name)
{
    var rawCSV = 
   $.ajax(
  {
    type: 'GET',
    async: false,
    url:  name
  }).responseText;
  
  return $.csv.toObjects(rawCSV);  
  
}