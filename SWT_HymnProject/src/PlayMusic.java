import java.io.File;
import java.io.IOException;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.DataLine;
import javax.sound.sampled.SourceDataLine;

import org.eclipse.swt.widgets.Shell;


public class PlayMusic {

	protected Shell shell;
	boolean isPlaying = false;
	private StoppableThread st;

	/**
	 * Create contents of the window.
	 */
	protected void play(final File file)
	{
		st = new StoppableThread()
		{
			public void run()
			{
				AudioInputStream din = null;
				try
				{
					AudioInputStream in = AudioSystem.getAudioInputStream(file);
					AudioFormat baseFormat = in.getFormat();
					AudioFormat decodedFormat = new AudioFormat(
							AudioFormat.Encoding.PCM_SIGNED,
							baseFormat.getSampleRate(), 16, baseFormat.getChannels(),
							baseFormat.getChannels() * 2, baseFormat.getSampleRate(),
							false);
					din = AudioSystem.getAudioInputStream(decodedFormat, in);
					DataLine.Info info = new DataLine.Info(SourceDataLine.class, decodedFormat);
					SourceDataLine line = (SourceDataLine)AudioSystem.getLine(info);
					if(line != null)
					{
						line.open(decodedFormat);
						byte[] data = new byte[16384];
						// Start
						line.start();
						System.out.println(file.getName() +  " (" + file.getAbsolutePath() + ")");
						int nBytesRead;
						while ((nBytesRead = din.read(data, 0, data.length)) != -1)
						{
							if (shouldStop()) break;
							line.write(data, 0, nBytesRead);
						}
						// Stop
						line.drain();
						line.stop();
						line.close();
						din.close();
					}
				}
				catch(Exception e) { e.printStackTrace(); }
				finally
				{
					if(din != null) { try { din.close(); } catch(IOException e) { } }
				}
				din = null;
			}
		};
		st.setPriority(Thread.MAX_PRIORITY);
		st.start();
	}
	
	protected void stop()
	{
		if (st != null && st.isAlive()) st.stopThread();
	}
}
