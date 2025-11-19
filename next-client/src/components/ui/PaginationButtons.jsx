import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationButtons({currentPage, setCurrentPage, totalPages}) {
  const pages = Array.from({length: totalPages}, (_, i) => i+1);

  return (
    <Pagination className="pb-15 md:pb-8 pt-5">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}  
          className="text-black dark:text-white bg-white dark:bg-zinc-800 cursor-pointer"/>
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page} >
            <PaginationLink
             isActive={page === currentPage}
             onClick={() => setCurrentPage(page)}
             className="text-black dark:text-white border  data-[active=true]:!text-orange-500 
              data-[active=true]:!border-orange-500 cursor-pointer" 
             >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationEllipsis className="text-orange-500" />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} 
          className="text-black dark:text-white bg-white dark:bg-zinc-800 cursor-pointer" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
