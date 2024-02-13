from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db' 
db = SQLAlchemy(app)
class Greenhouse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recovery_time = db.Column(db.Integer, nullable=False)
    size = db.Column(db.Float, nullable=False)
    crops = db.relationship('Crop', backref='greenhouse', lazy=True)

class Plant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    maturity_time = db.Column(db.Integer, nullable=False)
    size = db.Column(db.Float, nullable=False)
    crops = db.relationship('Crop', backref='plant', lazy=True)

class Crop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    greenhouse_id = db.Column(db.Integer, db.ForeignKey('greenhouse.id'), nullable=False)
    plant_id = db.Column(db.Integer, db.ForeignKey('plant.id'), nullable=False)
    count = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)

def add_data():
    with app.app_context():
        tomato = Plant(name='Tomato', maturity_time=90, size=0.5)
        cucumber = Plant(name='Cucumber', maturity_time=50, size=0.3)
        cabbage = Plant(name='Cabbage', maturity_time=120, size=1)
        eggplant = Plant(name='Eggplant', maturity_time=70, size=0.5)
        pepper = Plant(name='Pepper', maturity_time=60, size=0.4)
        strawberries = Plant(name='Strawberries', maturity_time=30, size=0.2)
        zucchini = Plant(name='Zucchini', maturity_time=55, size=0.6)
        carrot = Plant(name='Carrot', maturity_time=80, size=0.3)
        onion = Plant(name='Onion', maturity_time=90, size=0.25)
        garlic = Plant(name='Garlic', maturity_time=100, size=0.15)

        db.session.add_all([tomato, cucumber, cabbage, eggplant, pepper, strawberries, zucchini, carrot, onion, garlic])
        db.session.commit()

        greenhouse1 = Greenhouse(recovery_time=2, size=46.2)
        greenhouse2 = Greenhouse(recovery_time=3, size=87)
        greenhouse3 = Greenhouse(recovery_time=2, size=80.75)
        greenhouse4 = Greenhouse(recovery_time=1, size=32)
        greenhouse5 = Greenhouse(recovery_time=4, size=199.25)

        db.session.add_all([greenhouse1, greenhouse2, greenhouse3, greenhouse4, greenhouse5])
        db.session.commit()

        crop1 = Crop(greenhouse_id=1, plant_id=1, count=7, status='SOWN')
        crop2 = Crop(greenhouse_id=1, plant_id=2, count=1, status='SPROUT')
        crop3 = Crop(greenhouse_id=2, plant_id=7, count=5, status='SPROUT')
        crop4 = Crop(greenhouse_id=3, plant_id=9, count=13, status='FRUIT')
        crop5 = Crop(greenhouse_id=5, plant_id=9, count=3, status='FRUIT')

        db.session.add_all([crop1, crop2, crop3, crop4, crop5])
        db.session.commit()
def clear_data():
    with app.app_context():
        db.drop_all()
        db.create_all()
        add_data()

clear_data()
@app.route('/get_greenhouse_info/<int:greenhouse_id>', methods=['GET'])
def get_greenhouse_info(greenhouse_id):
    greenhouse = Greenhouse.query.filter_by(id=greenhouse_id).first()
    if greenhouse:
        greenhouse_info = {
            'id': greenhouse.id,
            'recovery_time': greenhouse.recovery_time,
            'size': greenhouse.size,
        }
        return jsonify(greenhouse_info)
    else:
        return jsonify({'error': 'Greenhouse not found'}), 404

@app.route('/get_plant_info_byName/<string:plant_name>')
def get_plant_info_byName(plant_name):
    plant = Plant.query.filter_by(name=plant_name).first()
    if plant:
        plant_info = {
            'id': plant.id,
            'name': plant.name,
            'maturity_time': plant.maturity_time,
            'size': plant.size,
        }
        return jsonify(plant_info)
    else:
        return jsonify({'error': 'Greenhouse not found'}), 404
    
@app.route('/get_plant_info_byID/<int:plant_id>')
def get_plant_info_byID(plant_id):
    plant = Plant.query.filter_by(id=plant_id).first()
    if plant:
        plant_info = {
            'name': plant.name,
            'maturity_time': plant.maturity_time,
            'size': plant.size,
        }
        return jsonify(plant_info)
    else:
        return jsonify({'error': 'Greenhouse not found'}), 404
@app.route('/get_crops_info/<int:greenhouse_id>', methods=['GET'])
def get_crops_info(greenhouse_id):
    crops = Crop.query.filter_by(greenhouse_id=greenhouse_id).all()
    crops_info = []

    for crop in crops:
        plant = Plant.query.get(crop.plant_id)
        if plant:
            crop_info = {
                'plant_size': plant.size,
                'name': plant.name,
                'plant_id': crop.plant_id,
                'count': crop.count,
                'status': crop.status,
            }
            crops_info.append(crop_info)

    return jsonify(crops_info)

@app.route('/add_plant_to_crops', methods=['POST'])
def add_plant_to_crops():
    data = request.json

    greenhouse_id = data.get('greenhouseId')
    plant_name = data.get('plantName')
    quantity = data.get('quantity')

    # Здійсніть необхідну обробку та збережіть рослини в культурах (Crops)
    try:
        greenhouse = Greenhouse.query.get(greenhouse_id)
        plant = Plant.query.filter_by(name=plant_name).first()

        if greenhouse and plant:
            crop = Crop(greenhouse_id=greenhouse_id, plant_id=plant.id, count=quantity, status='SOWN')
            db.session.add(crop)
            db.session.commit()

            return jsonify({'success': True, 'message': 'Plant added to Crops successfully'})
        else:
            return jsonify({'success': False, 'message': 'Invalid greenhouse or plant'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
@app.route('/delete_crop/<int:greenhouse_id>/<string:plant_name>', methods=['DELETE'])
def delete_crop(greenhouse_id, plant_name, status='FRUIT'):
    try:
        # Знаходження запису в базі даних за greenhouse_id та plant_name
        plant = Plant.query.filter_by(name=plant_name).first()

        if plant:
            # Знаходження запису в базі даних за greenhouse_id, plant_id та status
            crop_to_delete = Crop.query.filter_by(greenhouse_id=greenhouse_id, plant_id=plant.id, status=status).first()

            if crop_to_delete:
                db.session.delete(crop_to_delete)
                db.session.commit()
                return jsonify({'message': 'Crop deleted successfully'}), 200
            else:
                return jsonify({'error': 'Crop not found'}), 404
        else:
            return jsonify({'error': 'Plant not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/update_crop_quantity/<int:crop_id>', methods=['PUT'])
def update_crop_quantity(crop_id):
    try:
        crop = Crop.query.get(crop_id)
        if crop:
            data = request.get_json()
            new_quantity = data.get('quantity')

            crop.count = new_quantity
            db.session.commit()

            return jsonify({'message': 'Crop quantity updated successfully'}), 200
        else:
            return jsonify({'error': 'Crop not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_crop_status/<int:plantId>/<string:plantStatus>', methods=['PUT'])
def update_crop_status(plantId, plantStatus):
    crop = Crop.query.filter_by(plant_id=plantId, status=plantStatus).first()
    new_status = request.json.get('newStatus')

    if new_status is not None and crop:
        crop.status = new_status
        db.session.commit()

        return jsonify({'message': 'Crop status updated successfully'}), 200
    else:
        return jsonify({'error': 'Invalid request'}), 400

@app.route('/get_free_greenhouses_info', methods=['GET'])
def get_free_greenhouses_info():
    # Отримати інформацію про вільні теплиці (з size > 0 та crops is None)
    free_greenhouses = Greenhouse.query.filter(Greenhouse.size > 0).all()

    # Сформувати список з інформацією про вільні теплиці
    free_greenhouses_info = []
    for greenhouse in free_greenhouses:
        # Перевірити, чи Greenhouse.crops є None перед включенням його в вихідні дані
        greenhouse_info = {
            'greenhouse_id': greenhouse.id,
            'free_area': greenhouse.size,
        }
        free_greenhouses_info.append(greenhouse_info)
    return jsonify(free_greenhouses_info)

@app.route('/get_crops_for_harvesting', methods=['GET'])
def get_crops_for_harvesting():
    # You can implement your logic to fetch crop information for harvesting here
    # Example: Fetching data from the Crop table
    crops = Crop.query.filter_by(status='FRUIT').all()

    crops_info = []
    for crop in crops:
        greenhouse_info = {
            'greenhouseId': crop.greenhouse_id,
            'plantName': crop.plant.name,
            'count': crop.count,
            'status': crop.status,
        }
        crops_info.append(greenhouse_info)

    return jsonify(crops_info)

@app.route('/recalculate_greenhouse_sizes', methods=['GET'])
def recalculate_greenhouse_sizes():
    greenhouses = Greenhouse.query.all()
    greenhousesInfo = []

    for greenhouse in greenhouses:
        # Calculate the total size based on the crops
        total_size = greenhouse.size
        crops = Crop.query.filter_by(greenhouse_id=greenhouse.id).all()
        print(crops)
        for crop in crops:
            plant = Plant.query.get(crop.plant_id)
            if plant and isinstance(crop.count, (int, float)) and isinstance(plant.size, (int, float)):
                total_size -= crop.count * plant.size

        # Update the greenhouse size in the database
        greenhouse.size = max(total_size, 0)

        greenhouseInfo = {'greenhouseId': greenhouse.id, 'size': total_size}
        greenhousesInfo.append(greenhouseInfo)

    db.session.commit()

    return jsonify(greenhousesInfo)
@app.route('/update_greenhouse_size', methods=['POST'])
def update_greenhouse_size():
    data = request.get_json()

    if 'greenhouseId' not in data or 'newSize' not in data:
        return jsonify({'error': 'Invalid request'}), 400

    greenhouse_id = data['greenhouseId']
    new_size = data['newSize']

    greenhouse = Greenhouse.query.filter_by(id=greenhouse_id).first()

    if not greenhouse:
        return jsonify({'error': 'Greenhouse not found'}), 404

    greenhouse.size = new_size
    db.session.commit()

    return jsonify({'message': 'Greenhouse size updated successfully'}), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5500, debug=True)
