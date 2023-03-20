package onthemars.back.code.domain;

import com.sun.istack.NotNull;
import javax.persistence.Column;
import javax.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity @Getter
@AllArgsConstructor
@NoArgsConstructor
public class ColorCode extends Code{

    @Column(nullable = false)
    private @NotNull String hexCode;
}
