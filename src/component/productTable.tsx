import ProductRow from "./ProductRow";

interface Product {
    _id: string;
    productName: string;
    productPrice: number;
    productDescription: string;
    productImage: string;
}
export interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
  }

const ProductTable: React.FC<ProductTableProps> = ({ products, onAdd }) => {

    const handleEditProduct = (productId: string) => {
        console.log(`Edit product with ID: ${productId}`);
    };

    const handleDeleteProduct = (productId: string) => {
        console.log(`Delete product with ID: ${productId}`);
    };

    return (
        <div className="w-full max-w-6xl mx-auto my-8 overflow-x-auto shadow-lg rounded-lg bg-white">
            <div className="flex justify-end px-4 py-3 bg-gray-100 border-b border-gray-300">
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md shadow-sm"
                    onClick={onAdd}
                >
                    Add Product
                </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Product Image</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">ProductName</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Product Price</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Product Description</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Product category</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">Product Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <ProductRow 
                            key={product._id} 
                            product={product} 
                            onEdit={() => handleEditProduct(product._id)} 
                            onDelete={() => handleDeleteProduct(product._id)} 
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
