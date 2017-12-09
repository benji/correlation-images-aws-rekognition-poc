// http://docs.aws.amazon.com/rekognition/latest/dg/API_CompareFaces.html
// http://docs.aws.amazon.com/rekognition/latest/dg/images-bytes.html

var fs = require('fs');

var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

var credentials = new AWS.SharedIniFileCredentials({ profile: 'personal' });
AWS.config.credentials = credentials;

var rekognition = new AWS.Rekognition();

function compareFaces(path1, path2, setResult) {
  console.log('Comparing ' + path1 + ' and ' + path2);

  var data1 = fs.readFileSync(path1);
  var data2 = fs.readFileSync(path2);

  rekognition.compareFaces({
    "SimilarityThreshold": 0,
    "SourceImage": { "Bytes": data1 },
    "TargetImage": { "Bytes": data2 }
  }, function (err, data) {
    console.log('Done comparing ' + path1 + ' and ' + path2);
    if (err) {
      console.log('Error comparing ' + path1 + ' and ' + path2);
      console.log(err, err.stack);
      setResult('Error');
    } else {
      //      console.log(data);
      if (data.FaceMatches && data.FaceMatches.length > 0) {
        setResult(data.FaceMatches[0].Similarity);
      } else {
        console.log('Could not get a similarity comparing ' + path1 + ' and ' + path2);
        console.log(data);
        setResult('???');
      }
    }
  });
}

const dir = './images';
files = fs.readdirSync(dir)

const rmatrix = []

let nbExpectedCallbacks = 0;
let nbCallbacks = 0;

for (let i = 0; i < files.length; i++) {
  rmatrix[i] = [];
  for (let j = i + 1; j < files.length; j++) {
    const f1 = dir + '/' + files[i];
    const f2 = dir + '/' + files[j];
    nbExpectedCallbacks++;
    compareFaces(f1, f2, (similarity) => {
      rmatrix[i][j] = similarity;
      nbCallbacks++;
      if (nbCallbacks == nbExpectedCallbacks) {
        console.log(rmatrix);

        fs.writeFile("rmatrix.json", JSON.stringify({
          similarities_matrix: rmatrix,
          filenames: files
        }), 'utf8', function (err) {
          console.log("Saved.");
        });
      }
    });

  }
}