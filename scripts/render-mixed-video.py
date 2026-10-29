"""Render the 30s mixed-audience film. Requires ffmpeg and DejaVu fonts.

FFMPEG=/path/to/ffmpeg python3 scripts/render-mixed-video.py
"""
from pathlib import Path
import os
import subprocess

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
TMP = ROOT / '.video-render'
TMP.mkdir(exist_ok=True)
FFMPEG = os.environ.get('FFMPEG', 'ffmpeg')
SERIF = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
SANS = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
scenes = [
    ('src/assets/hero-forest.jpg', 'Você já entendeu muita coisa.', 'Mas ainda adia o próximo passo.'),
    ('public/media/grupo-misto-ia.png', 'Sua história merece escuta.', '60 min de entrevista individual'),
    ('public/media/grupo-misto-ia.png', 'Novas perspectivas, em grupo.', '240 min de Jogo do Herói · grupo misto'),
    ('public/media/grupo-misto-ia.png', 'Da reflexão ao próximo passo.', '60 min de plano coletivo + 30 dias de apoio de IA'),
    ('src/assets/horizon.jpg', 'OS RESSURGENTES', 'Homens e mulheres · Piloto R$250 por pessoa'),
]

def run(args):
    subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)

for i, (image, title, body) in enumerate(scenes):
    title_file = TMP / f'title-{i}.txt'
    body_file = TMP / f'body-{i}.txt'
    title_file.write_text(title)
    body_file.write_text(body)
    filters = (
        "scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,"
        "zoompan=z='1+on*0.0003':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=144:s=1280x720:fps=24,"
        "drawbox=x=0:y=430:w=iw:h=290:color=0x0D0F0E@0.72:t=fill,"
        f"drawtext=fontfile={SANS}:text='OS RESSURGENTES':fontsize=19:fontcolor=0xC9B99A:x=64:y=50,"
        "drawbox=x=64:y=476:w=70:h=2:color=0xA68A55:t=fill,"
        f"drawtext=fontfile={SERIF}:textfile='{title_file}':fontsize=43:fontcolor=0xF0EADF:x=64:y=505,"
        f"drawtext=fontfile={SANS}:textfile='{body_file}':fontsize=25:fontcolor=0xC9B99A:x=64:y=582,"
        "drawtext=fontfile=" + SANS + ":text='Conheça a Travessia':fontsize=20:fontcolor=0xC9B99A:x=64:y=655,"
        "fade=t=in:st=0:d=0.25,fade=t=out:st=5.8:d=0.2,format=yuv420p"
    )
    run(['-i', image, '-vf', filters, '-frames:v', '144', '-r', '24', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', str(TMP / f'scene-{i}.mp4')])

listing = TMP / 'scenes.txt'
listing.write_text(''.join(f"file '{TMP / f'scene-{i}.mp4'}'\n" for i in range(5)))
run(['-f', 'concat', '-safe', '0', '-i', str(listing), '-c', 'copy', '-movflags', '+faststart', 'public/media/os-ressurgentes-misto-30s.mp4'])
run(['-ss', '8', '-i', 'public/media/os-ressurgentes-misto-30s.mp4', '-frames:v', '1', '-q:v', '3', 'public/media/os-ressurgentes-misto-poster.jpg'])
print('Filme misto renderizado: 30s, 1280×720, 24fps, sem locução ou música.')
