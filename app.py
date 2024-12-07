from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

# Electronic Tools Routes
@app.route('/api/tools/ohms-law', methods=['POST'])
def ohms_law():
    data = request.get_json()
    try:
        if 'voltage' in data and 'current' in data:
            resistance = data['voltage'] / data['current']
            return jsonify({"resistance": resistance})
        elif 'voltage' in data and 'resistance' in data:
            current = data['voltage'] / data['resistance']
            return jsonify({"current": current})
        elif 'current' in data and 'resistance' in data:
            voltage = data['current'] * data['resistance']
            return jsonify({"voltage": voltage})
        else:
            return jsonify({"error": "Insufficient parameters"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/tools/led-resistor', methods=['POST'])
def led_resistor():
    data = request.get_json()
    try:
        source_voltage = data['sourceVoltage']
        led_voltage = data['ledVoltage']
        led_current = data['ledCurrent']  # in mA
        
        # Convert current from mA to A
        current = led_current / 1000
        
        # Calculate required resistor value
        resistance = (source_voltage - led_voltage) / current
        power = (source_voltage - led_voltage) * current
        
        return jsonify({
            "resistance": round(resistance, 2),
            "power": round(power, 3)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Software Tools Routes
@app.route('/api/tools/base-convert', methods=['POST'])
def base_convert():
    data = request.get_json()
    try:
        number = data['number']
        from_base = data['fromBase']
        to_base = data['toBase']
        
        # Convert to decimal first
        decimal = int(str(number), from_base)
        
        # Convert to target base
        if to_base == 2:
            result = bin(decimal)[2:]
        elif to_base == 8:
            result = oct(decimal)[2:]
        elif to_base == 16:
            result = hex(decimal)[2:].upper()
        else:
            result = str(decimal)
            
        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
