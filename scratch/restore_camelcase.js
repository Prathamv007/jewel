const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const replacements = {
    'userid': 'userId',
    'productid': 'productId',
    'orderid': 'orderId',
    'paymentid': 'paymentId',
    'paymentgateway': 'paymentGateway',
    'totalamount': 'totalAmount',
    'paymentstatus': 'paymentStatus',
    'orderstatus': 'orderStatus',
    'cartitems': 'cartItems',
    'shippingdetails': 'shippingDetails',
    'keyid': 'key_id', // Special case for Razorpay
    'sessionid': 'session_id', // Special case for Stripe
};

const srcDir = path.resolve(__dirname, '..', 'src');
const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    Object.keys(replacements).forEach(key => {
        const regex = new RegExp(key, 'g');
        content = content.replace(regex, replacements[key]);
    });

    if (content !== originalContent) {
        console.log(`Restoring camelCase in ${file}`);
        fs.writeFileSync(file, content, 'utf8');
    }
});
