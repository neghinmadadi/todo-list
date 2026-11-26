
function SortBy({sortBy, sortDirection, onSortByChange, onSortDirectionChange}) {
    
    return (
        <>
            <div>
                <label htmlFor="sortOption-select">Sort By</label>
                <select 
                    name="sortOptions" 
                    id="sortOption-select"
                    value={sortBy}
                    onChange={(event) => onSortByChange(event.target.value)}
                >
                    <option value="" disabled>Please choose a sort option</option>
                    <option value="createdAt">Created At</option>
                    <option value="title">Title</option>
                </select>
            </div>

            <div>
                <label htmlFor="sortDirection-select">Order</label>
                <select 
                    name="sortDirection" 
                    id="sortDirection-select"
                    value={sortDirection}
                    onChange={(event) => onSortDirectionChange(event.target.value)}
                >
                    <option value="" disabled>Please choose a sort order</option>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
        
        </>
    )
}

export default SortBy;

