using Homework.Domain.RequestModels.CategoriesRequestModels;
using Homework.Domain.ViewModels.CategoriesViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;
using Homework.Domain.Error;

namespace Homework.Domain.Interfaces.Services.CategoriesServices
{
    public interface IQueryCategoriesService
    {
        Task<List<CategoriesViewModel>> GetCategoriesList(GetCategoriesRequestModel request, CustomError error);
    }
}
