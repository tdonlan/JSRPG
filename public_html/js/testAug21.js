var JSON1 = {"name":"foo"};
var JSON2 = {"name":"baz"};
var JSONList = {"List":[{"name":"JSON1"},{"name":"JSON2"}]};

function testJSON(index)
{
    var objName = JSONList.List[index].name;
    
    
    return this[objName].name;
    
}