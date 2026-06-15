using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.Helpers;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Homework.ModelBinders
{
    public class CustomDataSourceLoadOptionsBinder : IModelBinder
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            var loadOptions = new DataSourceLoadOptionsBase();
            
            // Parse query string keys into loadOptions
            var query = bindingContext.ActionContext.HttpContext.Request.Query;
            DataSourceLoadOptionsParser.Parse(loadOptions, key => query[key].FirstOrDefault());

            bindingContext.Result = ModelBindingResult.Success(loadOptions);
            return Task.CompletedTask;
        }
    }

    public class CustomDataSourceLoadOptionsBinderProvider : IModelBinderProvider
    {
        public IModelBinder? GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            // Apply this binder automatically to any property or parameter of type DataSourceLoadOptionsBase
            if (context.Metadata.ModelType == typeof(DataSourceLoadOptionsBase))
            {
                return new BinderTypeModelBinder(typeof(CustomDataSourceLoadOptionsBinder));
            }

            return null;
        }
    }
}
