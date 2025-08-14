const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Route to seed database with sample data
router.post('/seed-database', async (req, res) => {
    const db = new sqlite3.Database(path.join(__dirname, '../database/stockweb.db'), (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            return res.status(500).json({ error: 'Database connection failed' });
        }
    });

    try {
        console.log('🌱 Starting database seeding...');

        // 1. Create admin user
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await runQuery(db, `INSERT OR IGNORE INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)`, 
            ['admin', 'admin@stockweb.com', hashedPassword, 'admin']);

        // 2. Create categories
        const categories = [
            ['Eletrônicos', 'Produtos eletrônicos e tecnologia'],
            ['Roupas', 'Vestuário e acessórios'],
            ['Casa e Jardim', 'Produtos para casa e jardim'],
            ['Esportes', 'Artigos esportivos e lazer'],
            ['Livros', 'Livros e material didático'],
            ['Alimentação', 'Alimentos e bebidas']
        ];

        for (const [name, description] of categories) {
            await runQuery(db, `INSERT OR IGNORE INTO Categories (name, description) VALUES (?, ?)`, [name, description]);
        }

        // 3. Create suppliers
        const suppliers = [
            ['Tech Distribuidora', 'João Silva', 'joao@techdist.com', '(11) 9999-1234', 'Rua das Flores, 123'],
            ['Moda & Estilo Ltda', 'Maria Santos', 'maria@modaestilo.com', '(11) 8888-5678', 'Av. Fashion, 456'],
            ['Casa & Cia', 'Pedro Oliveira', 'pedro@casacia.com', '(11) 7777-9012', 'Rua do Lar, 789'],
            ['Sports World', 'Ana Costa', 'ana@sportsworld.com', '(11) 6666-3456', 'Av. dos Esportes, 321'],
            ['Livros & Mais', 'Carlos Mendes', 'carlos@livrosemais.com', '(11) 5555-7890', 'Rua da Leitura, 654']
        ];

        for (const [name, contact, email, phone, address] of suppliers) {
            await runQuery(db, `INSERT OR IGNORE INTO Suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)`, 
                [name, contact, email, phone, address]);
        }

        // 4. Create customers
        const customers = [
            ['José', 'Silva', 'jose.silva@email.com', '(11) 1111-2222', 'Rua A, 100'],
            ['Maria', 'Santos', 'maria.santos@email.com', '(11) 3333-4444', 'Rua B, 200'],
            ['João', 'Oliveira', 'joao.oliveira@email.com', '(11) 5555-6666', 'Rua C, 300'],
            ['Ana', 'Costa', 'ana.costa@email.com', '(11) 7777-8888', 'Rua D, 400'],
            ['Carlos', 'Mendes', 'carlos.mendes@email.com', '(11) 9999-0000', 'Rua E, 500']
        ];

        for (const [firstName, lastName, email, phone, address] of customers) {
            await runQuery(db, `INSERT OR IGNORE INTO Customers (first_name, last_name, email, phone, address) VALUES (?, ?, ?, ?, ?)`, 
                [firstName, lastName, email, phone, address]);
        }

        // 5. Create products with proper stock levels
        const products = [
            // Eletrônicos (category_id: 1, supplier_id: 1)
            ['Smartphone Samsung Galaxy S21', 'Smartphone premium com 128GB', 1, 2499.99, 1899.99, 25, 5, '7891234567890', 1],
            ['iPhone 13', 'iPhone 13 com 128GB', 1, 3999.99, 3199.99, 15, 3, '7891234567891', 1],
            ['Notebook Dell Inspiron', 'Notebook Intel i5 8GB RAM 256GB SSD', 1, 2899.99, 2299.99, 8, 2, '7891234567892', 1],
            ['Tablet iPad', 'iPad 9ª geração 64GB', 1, 1999.99, 1599.99, 12, 3, '7891234567893', 1],
            ['Fone Bluetooth', 'Fone de ouvido sem fio com cancelamento de ruído', 1, 299.99, 199.99, 45, 10, '7891234567894', 1],

            // Roupas (category_id: 2, supplier_id: 2)
            ['Camiseta Nike', 'Camiseta esportiva 100% algodão', 2, 89.99, 49.99, 30, 10, '7891234567895', 2],
            ['Calça Jeans Levis', 'Calça jeans tradicional azul', 2, 189.99, 129.99, 20, 5, '7891234567896', 2],
            ['Tênis Adidas', 'Tênis esportivo para corrida', 2, 299.99, 199.99, 18, 5, '7891234567897', 2],
            ['Vestido Floral', 'Vestido estampado manga curta', 2, 149.99, 89.99, 15, 3, '7891234567898', 2],
            ['Jaqueta de Couro', 'Jaqueta de couro sintético preta', 2, 399.99, 249.99, 2, 5, '7891234567899', 2], // Low stock

            // Casa e Jardim (category_id: 3, supplier_id: 3)
            ['Sofá 3 Lugares', 'Sofá confortável cor cinza', 3, 1299.99, 899.99, 5, 1, '7891234567900', 3],
            ['Mesa de Jantar', 'Mesa de madeira para 6 pessoas', 3, 899.99, 599.99, 3, 1, '7891234567901', 3],
            ['Aspirador de Pó', 'Aspirador com filtro HEPA', 3, 399.99, 249.99, 12, 3, '7891234567902', 3],
            ['Kit Panelas', 'Conjunto de 5 panelas antiaderentes', 3, 199.99, 129.99, 20, 5, '7891234567903', 3],
            ['Luminária LED', 'Luminária de mesa com dimmer', 3, 89.99, 49.99, 0, 8, '7891234567904', 3], // Out of stock

            // Esportes (category_id: 4, supplier_id: 4)
            ['Bicicleta Mountain Bike', 'Bike aro 29 com 21 marchas', 4, 1199.99, 899.99, 6, 2, '7891234567905', 4],
            ['Bola de Futebol', 'Bola oficial de futebol society', 4, 59.99, 39.99, 35, 10, '7891234567906', 4],
            ['Raquete de Tênis', 'Raquete profissional com corda', 4, 299.99, 199.99, 12, 3, '7891234567907', 4],
            ['Kit Academia Casa', 'Kit com halteres e colchonete', 4, 199.99, 129.99, 1, 5, '7891234567908', 4], // Low stock
            ['Patins Inline', 'Patins ajustáveis tamanho 38-41', 4, 189.99, 129.99, 10, 3, '7891234567909', 4],

            // Livros (category_id: 5, supplier_id: 5)
            ['Clean Code', 'Livro sobre programação limpa', 5, 89.99, 59.99, 40, 10, '7891234567910', 5],
            ['Dom Casmurro', 'Clássico da literatura brasileira', 5, 29.99, 19.99, 50, 15, '7891234567911', 5],
            ['1984', 'Romance distópico de George Orwell', 5, 34.99, 24.99, 35, 10, '7891234567912', 5],
            ['O Pequeno Príncipe', 'Livro infantil clássico', 5, 24.99, 16.99, 60, 20, '7891234567913', 5],
            ['Sapiens', 'Uma breve história da humanidade', 5, 69.99, 49.99, 25, 8, '7891234567914', 5],

            // Alimentação (category_id: 6, supplier_id: 1)
            ['Café Premium', 'Café especial 500g', 6, 24.99, 16.99, 100, 20, '7891234567915', 1],
            ['Chocolate Belga', 'Chocolate importado 200g', 6, 19.99, 12.99, 80, 15, '7891234567916', 1],
            ['Azeite Extra Virgem', 'Azeite português 500ml', 6, 34.99, 24.99, 45, 10, '7891234567917', 1],
            ['Vinho Tinto', 'Vinho chileno 750ml', 6, 49.99, 34.99, 30, 8, '7891234567918', 1],
            ['Queijo Gourmet', 'Queijo artesanal 300g', 6, 29.99, 19.99, 0, 5, '7891234567919', 1] // Out of stock
        ];

        for (const [name, description, categoryId, price, cost, stock, minStock, barcode, supplierId] of products) {
            await runQuery(db, `INSERT OR IGNORE INTO Products (name, description, category_id, price, cost, stock_quantity, min_stock_level, barcode, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                [name, description, categoryId, price, cost, stock, minStock, barcode, supplierId]);
        }

        db.close();

        res.json({ 
            success: true, 
            message: 'Database seeded successfully!',
            data: {
                users: 1,
                categories: categories.length,
                suppliers: suppliers.length,
                customers: customers.length,
                products: products.length
            }
        });

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        db.close();
        res.status(500).json({ error: 'Failed to seed database', details: error.message });
    }
});

function runQuery(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

module.exports = router;
