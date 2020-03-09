module.exports = async function() {
  const variable = "How are you?"
  TranslatorConfiguration.setConfig(ProviderTypes.Google, 'AIzaSyB4IiebZ2y0IKH8JhxTI7HJeI8t2FO1iIA','fr', 'en');
  const translator = TranslatorFactory.createTranslator();

  if(translator != undefined && variable!=undefined){
    const respose = await translator.translate(variable);
    return respose;
  }else{
    return variable;
  }
   return ("test" + variable);
}
